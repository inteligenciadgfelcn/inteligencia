using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Text;
using System.Web.Security;

public partial class FELCN_CASOS_PAR_JUD_CASO : System.Web.UI.Page
{
    MembershipUser u;
    DateTime ahora = DateTime.Now;

    protected void Page_Load(object sender, EventArgs e)
    {
        u = Membership.GetUser(User.Identity.Name);
        LblUsuario.Text = u.ToString().Trim();
        if (!IsPostBack)
        {
            UsuarioUnidad();
            Muestracasos();
        }
    }

    private void UsuarioUnidad()
    {
        string strSQL = "SELECT DISTINCT Usuario, Uni_Abrev FROM USUARIOUNIDAD WHERE (Usuario = N'" + LblUsuario.Text.Trim() + "')";
        DataTable dtv = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        SqlCommand cmd = new SqlCommand(strSQL);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        sd.Fill(dtv);
        for (int i = 0; i < dtv.Rows.Count; i++)
        {
            LblUnidad.Text = dtv.Rows[i][1].ToString().Trim();
        }
        SqlConn.Close();
    }

    private void Muestracasos()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT INVESTPARALELA.InvPar_Id AS ip1, 'SIN RESPUESTA' AS ip2, DEPARTAMENTOSC.Descripcion AS ip3, UNIDADES.Uni_Descripcion AS ip4, DISTRITALES.Dis_Descripcion AS ip5, GRUPOS.Descripcion AS ip6, INVESTPARALELA.Delito AS ip7, INVESTPARALELA.NroCaso AS ip8, INVESTPARALELA.AsigCaso AS ip9, INVESTPARALELA.FiscalAsigCaso AS ip10, INVESTPARALELA.DelitoPresedente AS ip11, INVESTPARALELA.Informe AS ip12, CONVERT(varchar, INVESTPARALELA.FechaenvInvPara, 103) AS ip13, CONVERT(varchar,INVESTPARALELA.FecharesInvPara, 103) AS ip14 " +
                                                "FROM GRUPOS INNER JOIN DISTRITALES INNER JOIN INVESTPARALELA INNER JOIN DEPARTAMENTOSC ON INVESTPARALELA.DptoAv_Id = DEPARTAMENTOSC.DptoAv_Id INNER JOIN UNIDADES ON INVESTPARALELA.Uni_Abrev = UNIDADES.Uni_Abrev ON DISTRITALES.Dis_Id = INVESTPARALELA.Dis_Id ON GRUPOS.Grp_Id = INVESTPARALELA.Grp_Id " +
                                                "WHERE  (INVESTPARALELA.Resultado = 1) AND (INVESTPARALELA.RespInvParalela = 1) AND (INVESTPARALELA.Uni_Abrev = N'" + LblUnidad.Text.Trim() + "') ORDER BY ip13", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridCasos.DataSource = ds;
        GridCasos.DataBind();
        con.Close();
    }
}