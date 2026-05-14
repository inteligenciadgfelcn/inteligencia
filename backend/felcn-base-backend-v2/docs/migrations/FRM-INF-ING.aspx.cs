using GMapGeocoder;
using Subgurim.Controles;
using System;
using System.Activities.Expressions;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Forms_FRM_INF_ING : System.Web.UI.Page
{
    string usuariolog = HttpContext.Current.User.Identity.Name;
    string pase = Servicio.Verificarusuario(HttpContext.Current.User.Identity.Name);
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            if (Formularios.Verificar(usuariolog.Trim(), "FRM-INF-ING.aspx") == "SI")
            {
                txtdesde.Text = DateTime.Now.AddDays(-10).ToString("dd/MM/yyyy"); 
                txthasta.Text = DateTime.Now.ToString("dd/MM/yyyy");
                string valorgrupo = Servicio.UsuarioGrupo(usuariolog.Trim());
                muestraoperativos(valorgrupo.Trim());                
            }
            else
            {
                Response.Redirect("~/Forms/Default3.aspx");
            }
        }
    }
    protected void btnActualizar_Click(object sender, EventArgs e)
    {
        string valorgrupo = Servicio.UsuarioGrupo(usuariolog.Trim());
        Gridcasosing.DataSource = null;
        Gridcasosing.DataBind();
        Gridcasosact.DataSource = null;
        Gridcasosact.DataBind();
        muestraoperativos(valorgrupo.Trim());
    }
    protected void muestraoperativos(string distritalid)
    {       
        string CadenaFinal;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        CadenaFinal = "SELECT ASIGNACION.Casos_Id AS P1, UNIDADES.Uni_Descripcion AS P2, DISTRITALES.Dis_Descripcion AS P3, GRUPOS.Descripcion AS P4, ASIGNACION.NroCaso AS P5, ASIGNACION.NroCasoPerDom AS P6, ASIGNACION.NroOperativo AS P7, ASIGNACION.NombreCaso AS P8, OPERATIVO.Op_FechaOperativo AS P9, ASIGNACION.AsigCaso AS P10, ASIGNACION.FiscalAsigCaso AS P11 " + 
                      "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id INNER JOIN GRUPOS ON ASIGNACION.Grp_Id = GRUPOS.Grp_Id INNER JOIN OPERATIVO ON ASIGNACION.Casos_Id = OPERATIVO.Casos_Id " +
                      "WHERE (ASIGNACION.Dis_Id = " + distritalid.Trim() + ") AND (CONVERT(varchar, OPERATIVO.Op_Descripcion) = '') ORDER BY ASIGNACION.Casos_Id DESC";
        SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        Gridcasosing.DataSource = ds;
        Gridcasosing.DataBind();
        con.Close();
    }
    protected void btnnumerocaso_Click(object sender, EventArgs e)
    {
        string valorgrupo = Servicio.UsuarioGrupo(usuariolog.Trim());
        if (txtnumero.Text.Trim() != "")
        {
            muestraoperativosnumero(valorgrupo.Trim(), txtnumero.Text.Trim());
        }
    }
    protected void btnnombrecaso_Click(object sender, EventArgs e)
    {
        string valorgrupo = Servicio.UsuarioGrupo(usuariolog.Trim());
        if (txtnombre.Text.Trim() != "")
        {
            muestraoperativosnnombres(valorgrupo.Trim(), txtnombre.Text.Trim());
        }
    }
    protected void btnrango_Click(object sender, EventArgs e)
    {
        string valorgrupo = Servicio.UsuarioGrupo(usuariolog.Trim());
        if (txtdesde.Text.Trim() != "" & txthasta.Text.Trim()!="")
        {
            muestraoperativosfechas(valorgrupo.Trim(), txtdesde.Text.Trim(), txthasta.Text.Trim());
        }
    }
    protected void muestraoperativosnumero(string distritalid, string nrocaso)
    {        
        string CadenaFinal;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        CadenaFinal = "SELECT ASIGNACION.Casos_Id AS P1, UNIDADES.Uni_Descripcion AS P2, DISTRITALES.Dis_Descripcion AS P3, GRUPOS.Descripcion AS P4, ASIGNACION.NroCaso AS P5, ASIGNACION.NroCasoPerDom AS P6, ASIGNACION.NroOperativo AS P7, ASIGNACION.NombreCaso AS P8, ASIGNACION.AsigCaso AS P9, ASIGNACION.FiscalAsigCaso AS P10 " +
                      "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id INNER JOIN GRUPOS ON ASIGNACION.Grp_Id = GRUPOS.Grp_Id INNER JOIN OPERATIVO ON ASIGNACION.Casos_Id = OPERATIVO.Casos_Id " +
                      "WHERE (ASIGNACION.NroCaso = N'" + nrocaso.Trim() + "') AND (ASIGNACION.Dis_Id = " + distritalid.Trim() + ") AND (CONVERT(varchar, OPERATIVO.Op_Descripcion) <> '') ORDER BY ASIGNACION.Casos_Id DESC";
        SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        Gridcasosact.DataSource = ds;
        Gridcasosact.DataBind();
        con.Close();
    }
    protected void muestraoperativosnnombres(string distritalid, string nombrecaso)
    {
        string CadenaFinal;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        CadenaFinal = "SELECT ASIGNACION.Casos_Id AS P1, UNIDADES.Uni_Descripcion AS P2, DISTRITALES.Dis_Descripcion AS P3, GRUPOS.Descripcion AS P4, ASIGNACION.NroCaso AS P5, ASIGNACION.NroCasoPerDom AS P6, ASIGNACION.NroOperativo AS P7, ASIGNACION.NombreCaso AS P8, ASIGNACION.AsigCaso AS P9, ASIGNACION.FiscalAsigCaso AS P10 " +
                      "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id INNER JOIN GRUPOS ON ASIGNACION.Grp_Id = GRUPOS.Grp_Id INNER JOIN OPERATIVO ON ASIGNACION.Casos_Id = OPERATIVO.Casos_Id " +
                      "WHERE (ASIGNACION.NombreCaso = N'" + nombrecaso.Trim().ToUpper() + "') AND (ASIGNACION.Dis_Id = " + distritalid.Trim() + ") AND (CONVERT(varchar, OPERATIVO.Op_Descripcion) <> '') ORDER BY ASIGNACION.Casos_Id DESC";
        SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        Gridcasosact.DataSource = ds;
        Gridcasosact.DataBind();
        con.Close();
    }
    protected void muestraoperativosfechas(string distritalid, string desde, string hasta)
    {
        string CadenaFinal;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        CadenaFinal = "SELECT ASIGNACION.Casos_Id AS P1, UNIDADES.Uni_Descripcion AS P2, DISTRITALES.Dis_Descripcion AS P3, GRUPOS.Descripcion AS P4, ASIGNACION.NroCaso AS P5, ASIGNACION.NroCasoPerDom AS P6, ASIGNACION.NroOperativo AS P7, ASIGNACION.NombreCaso AS P8, ASIGNACION.AsigCaso AS P9, ASIGNACION.FiscalAsigCaso AS P10 " +
                      "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id INNER JOIN GRUPOS ON ASIGNACION.Grp_Id = GRUPOS.Grp_Id INNER JOIN OPERATIVO ON ASIGNACION.Casos_Id = OPERATIVO.Casos_Id " +
                      "WHERE (OPERATIVO.Op_FechaOperativo BETWEEN CONVERT(DATETIME, '"+ desde.Trim() +" 00:00', 103) AND CONVERT(DATETIME, '" + hasta.Trim() + " 23:59:59.999', 103)) AND (ASIGNACION.Dis_Id = " + distritalid.Trim() + ") AND (CONVERT(varchar, OPERATIVO.Op_Descripcion) <> '') ORDER BY ASIGNACION.Casos_Id DESC";
        SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        Gridcasosact.DataSource = ds;
        Gridcasosact.DataBind();
        con.Close();
    }
    protected void Gridcasosing_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row = Gridcasosing.SelectedRow;
        Response.Redirect("FRM-JUR-00?id=" + row.Cells[0].Text.Trim());
    } 
    protected void Gridcasosact_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName == "parametro1")
        {
            int index = Convert.ToInt32(e.CommandArgument);
            GridViewRow row = Gridcasosact.Rows[index];
            Response.Redirect("FRM-JUR-01?id=" + row.Cells[0].Text.Trim());
        }

        if (e.CommandName == "parametro2")
        {
            int index = Convert.ToInt32(e.CommandArgument);
            GridViewRow row = Gridcasosact.Rows[index];
            Response.Redirect("FRM-JUR-02?id=" + row.Cells[0].Text.Trim());
        }

        if (e.CommandName == "parametro3")
        {
            int index = Convert.ToInt32(e.CommandArgument);
            GridViewRow row = Gridcasosact.Rows[index];
            Response.Redirect("FRM-JUR-03?id=" + row.Cells[0].Text.Trim());
        }
    }
    protected void btnlimpiar_Click(object sender, EventArgs e)
    {
        Response.Redirect("~/Forms/FRM-INF-ING.aspx");
    }
}