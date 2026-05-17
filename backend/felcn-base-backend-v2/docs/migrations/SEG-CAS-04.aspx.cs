using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Forms_SEG_CAS_04 : System.Web.UI.Page
{
    string usuariolog = HttpContext.Current.User.Identity.Name;
    string pase = Servicio.Verificarusuario(HttpContext.Current.User.Identity.Name);
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            if (Formularios.Verificar(usuariolog.Trim(), "SEG-CAS-04.aspx") == "SI")
            {
                txtfechaini.Text = DateTime.Now.AddDays(-10).ToString("dd/MM/yyyy");
                txtfechafin.Text = DateTime.Now.ToString("dd/MM/yyyy");
                cbotipoDroga();
                cbotipooperativo();
                CboRelevancia();
            }
            else
            {
                Response.Redirect("~/Forms/Default3.aspx");
            }
        }
    }
    private void cbotipoDroga()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Td_Id, Descripcion FROM TIPOSDROGA";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbotipodr.ClearSelection();
        cbotipodr.Items.Clear();
        cboestdrog.ClearSelection();
        cboestdrog.Items.Clear();
        cbotipodr.Items.Add("Seleccione un Dato");
        cboestdrog.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbotipodr.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void cbotipodr_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT ESTADODROGA.EstDg_Id AS Expr1, ESTADODROGA.Descripcion AS Expr2 FROM ESTADODROGA INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id WHERE (TIPOSDROGA.Td_Id =" + Convert.ToInt32(cbotipodr.SelectedValue.Trim()) + ")";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboestdrog.ClearSelection();
        cboestdrog.Items.Clear();
        cboestdrog.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboestdrog.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void cbotipooperativo()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT TiOp_Id, Descripcion FROM TIPOOP";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbotipoop.ClearSelection();
        cbotipoop.Items.Clear();
        cbotipoop.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbotipoop.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void CboRelevancia()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT TiRel_Id, Descripcion FROM TIPORELEVANCIA";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cborelevancia.ClearSelection();
        cborelevancia.Items.Clear();
        cborelevancia.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cborelevancia.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void GridOperativos_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row = GridOperativos.SelectedRow;
        Response.Write("<script type='text/javascript'>window.open('RepOpeCaso?id=" + row.Cells[1].Text.Trim() + "');</script>");
    }
    protected void btnlimpiar_Click(object sender, EventArgs e)
    {
        Response.Redirect("~/Forms/SEG-CAS-04.aspx");
    }

    protected void btnfecha_Click(object sender, EventArgs e)
    {
        if (txtfechaini.Text != "" & txtfechafin.Text != "")
        {
            GridOperativos.DataSource = null;
            GridOperativos.DataBind();
            string CadenaFinal;
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            con.Open();
            CadenaFinal = "SELECT T2.Op_Id AS op1, T1.NroOperativo AS op2, T1.NroCaso AS op3, T1.NombreCaso AS op4, T1.AsigCaso AS op5, CONVERT(varchar, CAST(T2.Op_FechaOperativo AS datetime), 103) AS op6, T6.Descripcion + '-' + T7.Descripcion + '-' + UPPER(T8.Descripcion) + '-' + UPPER(RTRIM(T2.Op_Lugar)) AS op7, UPPER(RTRIM(T3.Uni_Descripcion)) + '-' + UPPER(RTRIM(T4.Dis_Descripcion)) + '-' + UPPER(RTRIM(T5.Descripcion)) AS op8, " +
                            "ISNULL((SELECT REPLACE(CONVERT(varchar(128), CAST(SUM(CocaCantidad) AS money), 1), '.00', '') AS Expr1 FROM HOJACOCA WHERE     (Op_Id = T2.Op_Id)), '') AS op9, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOSDROGA.Descripcion) +' Estado: '+ RTRIM(ESTADODROGA.Descripcion) +' Cantidad: '+ convert(varchar, cast(DROGAS.Dg_Cantidad as money), 1) +' Grs. Forma de Transporte: '+ RTRIM(FORMASTRANS.Formas_Descripcion) FROM DROGAS INNER JOIN ESTADODROGA ON DROGAS.EstDg_Id = ESTADODROGA.EstDg_Id INNER JOIN FORMASTRANS ON DROGAS.Formas_Id = FORMASTRANS.Formas_Id INNER JOIN PAIS ON DROGAS.Pa_Id = PAIS.Pa_Id INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id INNER JOIN OPERATIVO ON DROGAS.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id WHERE (OPERATIVO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op10," +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSSOLDESC.Ssd_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIASSOL.Ss_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIASSOL INNER JOIN SUSSOLDESC ON SUSTANCIASSOL.Ssd_Id = SUSSOLDESC.Ssd_Id WHERE (SUSTANCIASSOL.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op11, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSLIQDESC.Sld_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIALIQ.Sl_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIALIQ INNER JOIN SUSLIQDESC ON SUSTANCIALIQ.Sld_Id = SUSLIQDESC.Sld_Id WHERE (SUSTANCIALIQ.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op12, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOFABRICA.Descripcion) + ': ' + REPLACE(CONVERT(varchar(128), CAST(FABRICAS.Cantidad AS money), 1), '.00', '') FROM FABRICAS INNER JOIN FABRICAMODELOS ON FABRICAS.FabMod_id = FABRICAMODELOS.FabMod_id INNER JOIN TIPOFABRICA ON FABRICAMODELOS.Tf_Id = TIPOFABRICA.Tf_Id WHERE (FABRICAS.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op13, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(ARRESTADOSAUX.De_Nombres) + ' ' + RTRIM(ARRESTADOSAUX.De_Paterno) + ' ' + RTRIM(ARRESTADOSAUX.De_Materno) + ' ' + RTRIM(ARRESTADOSAUX.De_Esposo) + ' Nacionalidad: ' + PAIS.Descripcion FROM ARRESTADOSAUX INNER JOIN PAIS ON ARRESTADOSAUX.Pa_Id = PAIS.Pa_Id WHERE (ARRESTADOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op14, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(DETENIDOSAUX.De_Nombres) + ' ' + RTRIM(DETENIDOSAUX.De_Paterno) + ' ' + RTRIM(DETENIDOSAUX.De_Materno) + ' ' + RTRIM(DETENIDOSAUX.De_Esposo) + ' ' + RTRIM(PAIS.Descripcion) FROM DETENIDOSAUX INNER JOIN PAIS ON DETENIDOSAUX.Pa_Id = PAIS.Pa_Id INNER JOIN ESTADOCIVIL ON DETENIDOSAUX.Ec_id = ESTADOCIVIL.Ec_id WHERE (DETENIDOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op15, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(CATALOGOTIPO.Descripcion) FROM CATALOGOTIPO INNER JOIN ITEMBIENSECUESTRADO ON CATALOGOTIPO.CatTipo_Id = ITEMBIENSECUESTRADO.CatTipo_Id WHERE (ITEMBIENSECUESTRADO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op16 " +
                            "FROM ASIGNACION AS T1 INNER JOIN OPERATIVO AS T2 ON T1.Casos_Id = T2.Casos_Id INNER JOIN GRUPOS AS T5 INNER JOIN DISTRITALES AS T4 INNER JOIN UNIDADES AS T3 ON T4.Uni_Id = T3.Uni_Id ON T5.Dis_Id = T4.Dis_Id ON T1.Grp_Id = T5.Grp_Id INNER JOIN LOCALIDAD AS T8 ON T2.Loc_id = T8.Loc_id INNER JOIN PROVINCIAS AS T7 ON T8.Prov_Id = T7.Prov_Id INNER JOIN DEPARTAMENTOS AS T6 ON T7.Dpto_Id = T6.Dpto_Id " +
                            "WHERE (T2.Op_FechaOperativo BETWEEN CONVERT(DATETIME, '" + txtfechaini.Text.Trim() + " 00:00', 103) AND CONVERT(DATETIME, '" + txtfechafin.Text.Trim() + " 23:59:59.999', 103)) ORDER BY op6 DESC";
            SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
            DataSet ds = new DataSet();
            cmd.Fill(ds);
            GridOperativos.DataSource = ds;
            GridOperativos.DataBind();
            con.Close();
        }
    }
    protected void btncaso_Click(object sender, EventArgs e)
    {
        if (txtcaso.Text.Trim() != "")
        {
            GridOperativos.DataSource = null;
            GridOperativos.DataBind();
            string CadenaFinal;
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            con.Open();
            CadenaFinal = "SELECT T2.Op_Id AS op1, T1.NroOperativo AS op2, T1.NroCaso AS op3, T1.NombreCaso AS op4, T1.AsigCaso AS op5, CONVERT(varchar, CAST(T2.Op_FechaOperativo AS datetime), 103) AS op6, T6.Descripcion + '-' + T7.Descripcion + '-' + UPPER(T8.Descripcion) + '-' + UPPER(RTRIM(T2.Op_Lugar)) AS op7, UPPER(RTRIM(T3.Uni_Descripcion)) + '-' + UPPER(RTRIM(T4.Dis_Descripcion)) + '-' + UPPER(RTRIM(T5.Descripcion)) AS op8, " +
                          "ISNULL((SELECT REPLACE(CONVERT(varchar(128), CAST(SUM(CocaCantidad) AS money), 1), '.00', '') AS Expr1 FROM HOJACOCA WHERE     (Op_Id = T2.Op_Id)), '') AS op9, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOSDROGA.Descripcion) +' Estado: '+ RTRIM(ESTADODROGA.Descripcion) +' Cantidad: '+ convert(varchar, cast(DROGAS.Dg_Cantidad as money), 1) +' Grs. Forma de Transporte: '+ RTRIM(FORMASTRANS.Formas_Descripcion) FROM DROGAS INNER JOIN ESTADODROGA ON DROGAS.EstDg_Id = ESTADODROGA.EstDg_Id INNER JOIN FORMASTRANS ON DROGAS.Formas_Id = FORMASTRANS.Formas_Id INNER JOIN PAIS ON DROGAS.Pa_Id = PAIS.Pa_Id INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id INNER JOIN OPERATIVO ON DROGAS.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id WHERE (OPERATIVO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op10," +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSSOLDESC.Ssd_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIASSOL.Ss_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIASSOL INNER JOIN SUSSOLDESC ON SUSTANCIASSOL.Ssd_Id = SUSSOLDESC.Ssd_Id WHERE (SUSTANCIASSOL.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op11, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSLIQDESC.Sld_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIALIQ.Sl_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIALIQ INNER JOIN SUSLIQDESC ON SUSTANCIALIQ.Sld_Id = SUSLIQDESC.Sld_Id WHERE (SUSTANCIALIQ.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op12, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOFABRICA.Descripcion) + ': ' + REPLACE(CONVERT(varchar(128), CAST(FABRICAS.Cantidad AS money), 1), '.00', '') FROM FABRICAS INNER JOIN FABRICAMODELOS ON FABRICAS.FabMod_id = FABRICAMODELOS.FabMod_id INNER JOIN TIPOFABRICA ON FABRICAMODELOS.Tf_Id = TIPOFABRICA.Tf_Id WHERE (FABRICAS.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op13, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(ARRESTADOSAUX.De_Nombres) + ' ' + RTRIM(ARRESTADOSAUX.De_Paterno) + ' ' + RTRIM(ARRESTADOSAUX.De_Materno) + ' ' + RTRIM(ARRESTADOSAUX.De_Esposo) + ' Nacionalidad: ' + PAIS.Descripcion FROM ARRESTADOSAUX INNER JOIN PAIS ON ARRESTADOSAUX.Pa_Id = PAIS.Pa_Id WHERE (ARRESTADOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op14, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(DETENIDOSAUX.De_Nombres) + ' ' + RTRIM(DETENIDOSAUX.De_Paterno) + ' ' + RTRIM(DETENIDOSAUX.De_Materno) + ' ' + RTRIM(DETENIDOSAUX.De_Esposo) + ' ' + RTRIM(PAIS.Descripcion) FROM DETENIDOSAUX INNER JOIN PAIS ON DETENIDOSAUX.Pa_Id = PAIS.Pa_Id INNER JOIN ESTADOCIVIL ON DETENIDOSAUX.Ec_id = ESTADOCIVIL.Ec_id WHERE (DETENIDOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op15, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(CATALOGOTIPO.Descripcion) FROM CATALOGOTIPO INNER JOIN ITEMBIENSECUESTRADO ON CATALOGOTIPO.CatTipo_Id = ITEMBIENSECUESTRADO.CatTipo_Id WHERE (ITEMBIENSECUESTRADO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op16 " +
                          "FROM ASIGNACION AS T1 INNER JOIN OPERATIVO AS T2 ON T1.Casos_Id = T2.Casos_Id INNER JOIN GRUPOS AS T5 INNER JOIN DISTRITALES AS T4 INNER JOIN UNIDADES AS T3 ON T4.Uni_Id = T3.Uni_Id ON T5.Dis_Id = T4.Dis_Id ON T1.Grp_Id = T5.Grp_Id INNER JOIN LOCALIDAD AS T8 ON T2.Loc_id = T8.Loc_id INNER JOIN PROVINCIAS AS T7 ON T8.Prov_Id = T7.Prov_Id INNER JOIN DEPARTAMENTOS AS T6 ON T7.Dpto_Id = T6.Dpto_Id " +
                          "WHERE (T1.NroCaso LIKE N'%" + txtcaso.Text.Trim().ToUpper() + "%') ORDER BY op1 DESC";
            SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
            DataSet ds = new DataSet();
            cmd.Fill(ds);
            GridOperativos.DataSource = ds;
            GridOperativos.DataBind();
            con.Close();
        }
    }

    protected void tntipodroga_Click(object sender, EventArgs e)
    {
        if (cbotipodr.SelectedValue.Trim() != "Seleccione un Dato")
        {
            GridOperativos.DataSource = null;
            GridOperativos.DataBind();
            string CadenaFinal;
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            con.Open();
            CadenaFinal = "SELECT T2.Op_Id AS op1, T1.NroOperativo AS op2, T1.NroCaso AS op3, T1.NombreCaso AS op4, T1.AsigCaso AS op5, CONVERT(varchar, CAST(T2.Op_FechaOperativo AS datetime), 103) AS op6, T6.Descripcion + '-' + T7.Descripcion + '-' + UPPER(T8.Descripcion) + '-' + UPPER(RTRIM(T2.Op_Lugar)) AS op7, UPPER(RTRIM(T3.Uni_Descripcion)) + '-' + UPPER(RTRIM(T4.Dis_Descripcion)) + '-' + UPPER(RTRIM(T5.Descripcion)) AS op8, " +
                          "ISNULL((SELECT REPLACE(CONVERT(varchar(128), CAST(SUM(CocaCantidad) AS money), 1), '.00', '') AS Expr1 FROM HOJACOCA WHERE     (Op_Id = T2.Op_Id)), '') AS op9, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOSDROGA.Descripcion) +' Estado: '+ RTRIM(ESTADODROGA.Descripcion) +' Cantidad: '+ convert(varchar, cast(DROGAS.Dg_Cantidad as money), 1) +' Grs. Forma de Transporte: '+ RTRIM(FORMASTRANS.Formas_Descripcion) FROM DROGAS INNER JOIN ESTADODROGA ON DROGAS.EstDg_Id = ESTADODROGA.EstDg_Id INNER JOIN FORMASTRANS ON DROGAS.Formas_Id = FORMASTRANS.Formas_Id INNER JOIN PAIS ON DROGAS.Pa_Id = PAIS.Pa_Id INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id INNER JOIN OPERATIVO ON DROGAS.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id WHERE (OPERATIVO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op10," +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSSOLDESC.Ssd_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIASSOL.Ss_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIASSOL INNER JOIN SUSSOLDESC ON SUSTANCIASSOL.Ssd_Id = SUSSOLDESC.Ssd_Id WHERE (SUSTANCIASSOL.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op11, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSLIQDESC.Sld_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIALIQ.Sl_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIALIQ INNER JOIN SUSLIQDESC ON SUSTANCIALIQ.Sld_Id = SUSLIQDESC.Sld_Id WHERE (SUSTANCIALIQ.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op12, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOFABRICA.Descripcion) + ': ' + REPLACE(CONVERT(varchar(128), CAST(FABRICAS.Cantidad AS money), 1), '.00', '') FROM FABRICAS INNER JOIN FABRICAMODELOS ON FABRICAS.FabMod_id = FABRICAMODELOS.FabMod_id INNER JOIN TIPOFABRICA ON FABRICAMODELOS.Tf_Id = TIPOFABRICA.Tf_Id WHERE (FABRICAS.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op13, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(ARRESTADOSAUX.De_Nombres) + ' ' + RTRIM(ARRESTADOSAUX.De_Paterno) + ' ' + RTRIM(ARRESTADOSAUX.De_Materno) + ' ' + RTRIM(ARRESTADOSAUX.De_Esposo) + ' Nacionalidad: ' + PAIS.Descripcion FROM ARRESTADOSAUX INNER JOIN PAIS ON ARRESTADOSAUX.Pa_Id = PAIS.Pa_Id WHERE (ARRESTADOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op14, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(DETENIDOSAUX.De_Nombres) + ' ' + RTRIM(DETENIDOSAUX.De_Paterno) + ' ' + RTRIM(DETENIDOSAUX.De_Materno) + ' ' + RTRIM(DETENIDOSAUX.De_Esposo) + ' ' + RTRIM(PAIS.Descripcion) FROM DETENIDOSAUX INNER JOIN PAIS ON DETENIDOSAUX.Pa_Id = PAIS.Pa_Id INNER JOIN ESTADOCIVIL ON DETENIDOSAUX.Ec_id = ESTADOCIVIL.Ec_id WHERE (DETENIDOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op15, " +
                          "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(CATALOGOTIPO.Descripcion) FROM CATALOGOTIPO INNER JOIN ITEMBIENSECUESTRADO ON CATALOGOTIPO.CatTipo_Id = ITEMBIENSECUESTRADO.CatTipo_Id WHERE (ITEMBIENSECUESTRADO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op16 " +
                          "FROM ASIGNACION AS T1 INNER JOIN OPERATIVO AS T2 ON T1.Casos_Id = T2.Casos_Id INNER JOIN GRUPOS AS T5 INNER JOIN DISTRITALES AS T4 INNER JOIN UNIDADES AS T3 ON T4.Uni_Id = T3.Uni_Id ON T5.Dis_Id = T4.Dis_Id ON T1.Grp_Id = T5.Grp_Id INNER JOIN LOCALIDAD AS T8 ON T2.Loc_id = T8.Loc_id INNER JOIN PROVINCIAS AS T7 ON T8.Prov_Id = T7.Prov_Id INNER JOIN DEPARTAMENTOS AS T6 ON T7.Dpto_Id = T6.Dpto_Id INNER JOIN DROGAS AS T9 ON T2.Op_Id = T9.Op_Id INNER JOIN ESTADODROGA AS T10 ON T9.EstDg_Id = T10.EstDg_Id " +
                          "WHERE (T2.Op_FechaOperativo BETWEEN CONVERT(DATETIME, '" + txtfechaini.Text.Trim() + " 00:00', 103) AND CONVERT(DATETIME, '" + txtfechafin.Text.Trim() + " 23:59:59.999', 103)) AND (T10.Td_Id ='" + cbotipodr.SelectedValue.Trim() + "') ORDER BY op1 DESC";
            SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
            DataSet ds = new DataSet();
            cmd.Fill(ds);
            GridOperativos.DataSource = ds;
            GridOperativos.DataBind();
            con.Close();
        }
    }

    protected void btnestadroga_Click(object sender, EventArgs e)
    {
        if (cbotipodr.SelectedValue.Trim() != "Seleccione un Dato")
        {
            GridOperativos.DataSource = null;
            GridOperativos.DataBind();
            string CadenaFinal;
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            con.Open();
            CadenaFinal = "SELECT T2.Op_Id AS op1, T1.NroOperativo AS op2, T1.NroCaso AS op3, T1.NombreCaso AS op4, T1.AsigCaso AS op5, CONVERT(varchar, CAST(T2.Op_FechaOperativo AS datetime), 103) AS op6, " +
                            "T6.Descripcion + '-' + T7.Descripcion + '-' + UPPER(T8.Descripcion) + '-' + UPPER(RTRIM(T2.Op_Lugar)) AS op7, UPPER(RTRIM(T4.Dis_Descripcion)) + '-' + UPPER(RTRIM(T5.Descripcion)) AS op8, " +
                            "ISNULL((SELECT REPLACE(CONVERT(varchar(128), CAST(SUM(CocaCantidad) AS money), 1), '.00', '') FROM HOJACOCA WHERE (Op_Id = T2.Op_Id)),'') AS op9, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOSDROGA.Descripcion) +' Estado: '+ RTRIM(ESTADODROGA.Descripcion) +' Cantidad: '+ convert(varchar, cast(DROGAS.Dg_Cantidad as money), 1) +' Grs. Forma de Transporte: '+ RTRIM(FORMASTRANS.Formas_Descripcion) FROM DROGAS INNER JOIN ESTADODROGA ON DROGAS.EstDg_Id = ESTADODROGA.EstDg_Id INNER JOIN FORMASTRANS ON DROGAS.Formas_Id = FORMASTRANS.Formas_Id INNER JOIN PAIS ON DROGAS.Pa_Id = PAIS.Pa_Id INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id INNER JOIN OPERATIVO ON DROGAS.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id WHERE (OPERATIVO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op10, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSSOLDESC.Ssd_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIASSOL.Ss_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIASSOL INNER JOIN SUSSOLDESC ON SUSTANCIASSOL.Ssd_Id = SUSSOLDESC.Ssd_Id WHERE (SUSTANCIASSOL.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op11, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSLIQDESC.Sld_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIALIQ.Sl_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIALIQ INNER JOIN SUSLIQDESC ON SUSTANCIALIQ.Sld_Id = SUSLIQDESC.Sld_Id WHERE (SUSTANCIALIQ.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op12, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOFABRICA.Descripcion) + ': ' + REPLACE(CONVERT(varchar(128), CAST(FABRICAS.Cantidad AS money), 1), '.00', '') FROM FABRICAS INNER JOIN FABRICAMODELOS ON FABRICAS.FabMod_id = FABRICAMODELOS.FabMod_id INNER JOIN TIPOFABRICA ON FABRICAMODELOS.Tf_Id = TIPOFABRICA.Tf_Id WHERE (FABRICAS.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op13, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(ARRESTADOSAUX.De_Nombres) + ' ' + RTRIM(ARRESTADOSAUX.De_Paterno) + ' ' + RTRIM(ARRESTADOSAUX.De_Materno) + ' ' + RTRIM(ARRESTADOSAUX.De_Esposo) + ' Nacionalidad: ' + PAIS.Descripcion FROM ARRESTADOSAUX INNER JOIN PAIS ON ARRESTADOSAUX.Pa_Id = PAIS.Pa_Id WHERE (ARRESTADOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op14, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(DETENIDOSAUX.De_Nombres) + ' ' + RTRIM(DETENIDOSAUX.De_Paterno) + ' ' + RTRIM(DETENIDOSAUX.De_Materno) + ' ' + RTRIM(DETENIDOSAUX.De_Esposo) + ' ' + RTRIM(PAIS.Descripcion) FROM DETENIDOSAUX INNER JOIN PAIS ON DETENIDOSAUX.Pa_Id = PAIS.Pa_Id INNER JOIN ESTADOCIVIL ON DETENIDOSAUX.Ec_id = ESTADOCIVIL.Ec_id WHERE (DETENIDOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op15, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(CATALOGOTIPO.Descripcion) FROM CATALOGOTIPO INNER JOIN ITEMBIENSECUESTRADO ON CATALOGOTIPO.CatTipo_Id = ITEMBIENSECUESTRADO.CatTipo_Id WHERE (ITEMBIENSECUESTRADO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op16 " +
                            "FROM ASIGNACION AS T1 INNER JOIN OPERATIVO AS T2 ON T1.Casos_Id = T2.Casos_Id INNER JOIN GRUPOS AS T5 INNER JOIN DISTRITALES AS T4 INNER JOIN UNIDADES AS T3 ON T4.Uni_Id = T3.Uni_Id ON T5.Dis_Id = T4.Dis_Id ON T1.Grp_Id = T5.Grp_Id INNER JOIN LOCALIDAD AS T8 ON T2.Loc_id = T8.Loc_id INNER JOIN PROVINCIAS AS T7 ON T8.Prov_Id = T7.Prov_Id INNER JOIN DEPARTAMENTOS AS T6 ON T7.Dpto_Id = T6.Dpto_Id INNER JOIN DROGAS AS T9 ON T2.Op_Id = T9.Op_Id " +
                            "WHERE (T2.Op_FechaOperativo BETWEEN CONVERT(DATETIME, '" + txtfechaini.Text.Trim() + " 00:00', 103) AND CONVERT(DATETIME, '" + txtfechafin.Text.Trim() + " 23:59:59.999', 103)) AND (T9.EstDg_Id ='" + cboestdrog.SelectedValue.Trim() + "') ORDER BY op1 DESC";
            SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
            DataSet ds = new DataSet();
            cmd.Fill(ds);
            GridOperativos.DataSource = ds;
            GridOperativos.DataBind();
            con.Close();
        }
    }
    protected void btntipooper_Click(object sender, EventArgs e)
    {
        if (cbotipoop.SelectedValue.Trim() != "Seleccione un Dato")
        {
            GridOperativos.DataSource = null;
            GridOperativos.DataBind();
            string CadenaFinal;
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            con.Open();
            CadenaFinal = "SELECT T2.Op_Id AS op1, T1.NroOperativo AS op2, T1.NroCaso AS op3, T1.NombreCaso AS op4, T1.AsigCaso AS op5, CONVERT(varchar, CAST(T2.Op_FechaOperativo AS datetime), 103) AS op6, " +
                            "T6.Descripcion + '-' + T7.Descripcion + '-' + UPPER(T8.Descripcion) + '-' + UPPER(RTRIM(T2.Op_Lugar)) AS op7, UPPER(RTRIM(T4.Dis_Descripcion)) + '-' + UPPER(RTRIM(T5.Descripcion)) AS op8, " +
                            "ISNULL((SELECT REPLACE(CONVERT(varchar(128), CAST(SUM(CocaCantidad) AS money), 1), '.00', '') FROM HOJACOCA WHERE (Op_Id = T2.Op_Id)),'') AS op9, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOSDROGA.Descripcion) +' Estado: '+ RTRIM(ESTADODROGA.Descripcion) +' Cantidad: '+ convert(varchar, cast(DROGAS.Dg_Cantidad as money), 1) +' Grs. Forma de Transporte: '+ RTRIM(FORMASTRANS.Formas_Descripcion) FROM DROGAS INNER JOIN ESTADODROGA ON DROGAS.EstDg_Id = ESTADODROGA.EstDg_Id INNER JOIN FORMASTRANS ON DROGAS.Formas_Id = FORMASTRANS.Formas_Id INNER JOIN PAIS ON DROGAS.Pa_Id = PAIS.Pa_Id INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id INNER JOIN OPERATIVO ON DROGAS.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id WHERE (OPERATIVO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op10, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSSOLDESC.Ssd_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIASSOL.Ss_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIASSOL INNER JOIN SUSSOLDESC ON SUSTANCIASSOL.Ssd_Id = SUSSOLDESC.Ssd_Id WHERE (SUSTANCIASSOL.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op11, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSLIQDESC.Sld_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIALIQ.Sl_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIALIQ INNER JOIN SUSLIQDESC ON SUSTANCIALIQ.Sld_Id = SUSLIQDESC.Sld_Id WHERE (SUSTANCIALIQ.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op12, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOFABRICA.Descripcion) + ': ' + REPLACE(CONVERT(varchar(128), CAST(FABRICAS.Cantidad AS money), 1), '.00', '') FROM FABRICAS INNER JOIN FABRICAMODELOS ON FABRICAS.FabMod_id = FABRICAMODELOS.FabMod_id INNER JOIN TIPOFABRICA ON FABRICAMODELOS.Tf_Id = TIPOFABRICA.Tf_Id WHERE (FABRICAS.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op13, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(ARRESTADOSAUX.De_Nombres) + ' ' + RTRIM(ARRESTADOSAUX.De_Paterno) + ' ' + RTRIM(ARRESTADOSAUX.De_Materno) + ' ' + RTRIM(ARRESTADOSAUX.De_Esposo) + ' Nacionalidad: ' + PAIS.Descripcion FROM ARRESTADOSAUX INNER JOIN PAIS ON ARRESTADOSAUX.Pa_Id = PAIS.Pa_Id WHERE (ARRESTADOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op14, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(DETENIDOSAUX.De_Nombres) + ' ' + RTRIM(DETENIDOSAUX.De_Paterno) + ' ' + RTRIM(DETENIDOSAUX.De_Materno) + ' ' + RTRIM(DETENIDOSAUX.De_Esposo) + ' ' + RTRIM(PAIS.Descripcion) FROM DETENIDOSAUX INNER JOIN PAIS ON DETENIDOSAUX.Pa_Id = PAIS.Pa_Id INNER JOIN ESTADOCIVIL ON DETENIDOSAUX.Ec_id = ESTADOCIVIL.Ec_id WHERE (DETENIDOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op15, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(CATALOGOTIPO.Descripcion) FROM CATALOGOTIPO INNER JOIN ITEMBIENSECUESTRADO ON CATALOGOTIPO.CatTipo_Id = ITEMBIENSECUESTRADO.CatTipo_Id WHERE (ITEMBIENSECUESTRADO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op16 " +
                            "FROM ASIGNACION AS T1 INNER JOIN OPERATIVO AS T2 ON T1.Casos_Id = T2.Casos_Id INNER JOIN GRUPOS AS T5 INNER JOIN DISTRITALES AS T4 INNER JOIN UNIDADES AS T3 ON T4.Uni_Id = T3.Uni_Id ON T5.Dis_Id = T4.Dis_Id ON T1.Grp_Id = T5.Grp_Id INNER JOIN LOCALIDAD AS T8 ON T2.Loc_id = T8.Loc_id INNER JOIN PROVINCIAS AS T7 ON T8.Prov_Id = T7.Prov_Id INNER JOIN DEPARTAMENTOS AS T6 ON T7.Dpto_Id = T6.Dpto_Id " +
                            "WHERE (T2.Op_FechaOperativo BETWEEN CONVERT(DATETIME, '" + txtfechaini.Text.Trim() + " 00:00', 103) AND CONVERT(DATETIME, '" + txtfechafin.Text.Trim() + " 23:59:59.999', 103)) AND (T2.TiOp_Id = " + cbotipoop.SelectedValue.Trim() + ") ORDER BY op1 DESC";
            SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
            DataSet ds = new DataSet();
            cmd.Fill(ds);
            GridOperativos.DataSource = ds;
            GridOperativos.DataBind();
            con.Close();
        }
    }
    protected void btnrelev_Click(object sender, EventArgs e)
    {
        if (cborelevancia.SelectedValue.Trim() != "Seleccione un Dato")
        {
            GridOperativos.DataSource = null;
            GridOperativos.DataBind();
            string CadenaFinal;
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            con.Open();
            CadenaFinal = "SELECT T2.Op_Id AS op1, T1.NroOperativo AS op2, T1.NroCaso AS op3, T1.NombreCaso AS op4, T1.AsigCaso AS op5, CONVERT(varchar, CAST(T2.Op_FechaOperativo AS datetime), 103) AS op6, " +
                            "T6.Descripcion + '-' + T7.Descripcion + '-' + UPPER(T8.Descripcion) + '-' + UPPER(RTRIM(T2.Op_Lugar)) AS op7, UPPER(RTRIM(T4.Dis_Descripcion)) + '-' + UPPER(RTRIM(T5.Descripcion)) AS op8, " +
                            "ISNULL((SELECT REPLACE(CONVERT(varchar(128), CAST(SUM(CocaCantidad) AS money), 1), '.00', '') FROM HOJACOCA WHERE (Op_Id = T2.Op_Id)),'') AS op9, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOSDROGA.Descripcion) +' Estado: '+ RTRIM(ESTADODROGA.Descripcion) +' Cantidad: '+ convert(varchar, cast(DROGAS.Dg_Cantidad as money), 1) +' Grs. Forma de Transporte: '+ RTRIM(FORMASTRANS.Formas_Descripcion) FROM DROGAS INNER JOIN ESTADODROGA ON DROGAS.EstDg_Id = ESTADODROGA.EstDg_Id INNER JOIN FORMASTRANS ON DROGAS.Formas_Id = FORMASTRANS.Formas_Id INNER JOIN PAIS ON DROGAS.Pa_Id = PAIS.Pa_Id INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id INNER JOIN OPERATIVO ON DROGAS.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id WHERE (OPERATIVO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op10, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSSOLDESC.Ssd_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIASSOL.Ss_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIASSOL INNER JOIN SUSSOLDESC ON SUSTANCIASSOL.Ssd_Id = SUSSOLDESC.Ssd_Id WHERE (SUSTANCIASSOL.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op11, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSLIQDESC.Sld_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIALIQ.Sl_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIALIQ INNER JOIN SUSLIQDESC ON SUSTANCIALIQ.Sld_Id = SUSLIQDESC.Sld_Id WHERE (SUSTANCIALIQ.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op12, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOFABRICA.Descripcion) + ': ' + REPLACE(CONVERT(varchar(128), CAST(FABRICAS.Cantidad AS money), 1), '.00', '') FROM FABRICAS INNER JOIN FABRICAMODELOS ON FABRICAS.FabMod_id = FABRICAMODELOS.FabMod_id INNER JOIN TIPOFABRICA ON FABRICAMODELOS.Tf_Id = TIPOFABRICA.Tf_Id WHERE (FABRICAS.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op13, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(ARRESTADOSAUX.De_Nombres) + ' ' + RTRIM(ARRESTADOSAUX.De_Paterno) + ' ' + RTRIM(ARRESTADOSAUX.De_Materno) + ' ' + RTRIM(ARRESTADOSAUX.De_Esposo) + ' Nacionalidad: ' + PAIS.Descripcion FROM ARRESTADOSAUX INNER JOIN PAIS ON ARRESTADOSAUX.Pa_Id = PAIS.Pa_Id WHERE (ARRESTADOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op14, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(DETENIDOSAUX.De_Nombres) + ' ' + RTRIM(DETENIDOSAUX.De_Paterno) + ' ' + RTRIM(DETENIDOSAUX.De_Materno) + ' ' + RTRIM(DETENIDOSAUX.De_Esposo) + ' ' + RTRIM(PAIS.Descripcion) FROM DETENIDOSAUX INNER JOIN PAIS ON DETENIDOSAUX.Pa_Id = PAIS.Pa_Id INNER JOIN ESTADOCIVIL ON DETENIDOSAUX.Ec_id = ESTADOCIVIL.Ec_id WHERE (DETENIDOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op15, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(CATALOGOTIPO.Descripcion) FROM CATALOGOTIPO INNER JOIN ITEMBIENSECUESTRADO ON CATALOGOTIPO.CatTipo_Id = ITEMBIENSECUESTRADO.CatTipo_Id WHERE (ITEMBIENSECUESTRADO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op16 " +
                            "FROM ASIGNACION AS T1 INNER JOIN OPERATIVO AS T2 ON T1.Casos_Id = T2.Casos_Id INNER JOIN GRUPOS AS T5 INNER JOIN DISTRITALES AS T4 INNER JOIN UNIDADES AS T3 ON T4.Uni_Id = T3.Uni_Id ON T5.Dis_Id = T4.Dis_Id ON T1.Grp_Id = T5.Grp_Id INNER JOIN LOCALIDAD AS T8 ON T2.Loc_id = T8.Loc_id INNER JOIN PROVINCIAS AS T7 ON T8.Prov_Id = T7.Prov_Id INNER JOIN DEPARTAMENTOS AS T6 ON T7.Dpto_Id = T6.Dpto_Id " +
                            "WHERE (T2.Op_FechaOperativo BETWEEN CONVERT(DATETIME, '" + txtfechaini.Text.Trim() + " 00:00', 103) AND CONVERT(DATETIME, '" + txtfechafin.Text.Trim() + " 23:59:59.999', 103)) AND (T2.TiRel_Id = " + cborelevancia.SelectedValue.Trim() + ") ORDER BY op1 DESC";
            SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
            DataSet ds = new DataSet();
            cmd.Fill(ds);
            GridOperativos.DataSource = ds;
            GridOperativos.DataBind();
            con.Close();
        }
    }

    protected void btnaprehen_Click(object sender, EventArgs e)
    {
        if (txtnombre.Text.Trim() != "" || txtpaterno.Text.Trim() != "" || txtmaterno.Text.Trim() != "" || txtesposo.Text.Trim() != "")
        {
            GridOperativos.DataSource = null;
            GridOperativos.DataBind();
            string CadenaFinal;
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            con.Open();
            CadenaFinal = "SELECT T2.Op_Id AS op1, T1.NroOperativo AS op2, T1.NroCaso AS op3, T1.NombreCaso AS op4, T1.AsigCaso AS op5, CONVERT(varchar, CAST(T2.Op_FechaOperativo AS datetime), 103) AS op6, " +
                            "T6.Descripcion + '-' + T7.Descripcion + '-' + UPPER(T8.Descripcion) + '-' + UPPER(RTRIM(T2.Op_Lugar)) AS op7, UPPER(RTRIM(T4.Dis_Descripcion)) + '-' + UPPER(RTRIM(T5.Descripcion)) AS op8, " +
                            "ISNULL((SELECT REPLACE(CONVERT(varchar(128), CAST(SUM(CocaCantidad) AS money), 1), '.00', '') FROM HOJACOCA WHERE (Op_Id = T2.Op_Id)),'') AS op9, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOSDROGA.Descripcion) +' Estado: '+ RTRIM(ESTADODROGA.Descripcion) +' Cantidad: '+ convert(varchar, cast(DROGAS.Dg_Cantidad as money), 1) +' Grs. Forma de Transporte: '+ RTRIM(FORMASTRANS.Formas_Descripcion) FROM DROGAS INNER JOIN ESTADODROGA ON DROGAS.EstDg_Id = ESTADODROGA.EstDg_Id INNER JOIN FORMASTRANS ON DROGAS.Formas_Id = FORMASTRANS.Formas_Id INNER JOIN PAIS ON DROGAS.Pa_Id = PAIS.Pa_Id INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id INNER JOIN OPERATIVO ON DROGAS.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id WHERE (OPERATIVO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op10, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSSOLDESC.Ssd_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIASSOL.Ss_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIASSOL INNER JOIN SUSSOLDESC ON SUSTANCIASSOL.Ssd_Id = SUSSOLDESC.Ssd_Id WHERE (SUSTANCIASSOL.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op11, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSLIQDESC.Sld_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIALIQ.Sl_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIALIQ INNER JOIN SUSLIQDESC ON SUSTANCIALIQ.Sld_Id = SUSLIQDESC.Sld_Id WHERE (SUSTANCIALIQ.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op12, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOFABRICA.Descripcion) + ': ' + REPLACE(CONVERT(varchar(128), CAST(FABRICAS.Cantidad AS money), 1), '.00', '') FROM FABRICAS INNER JOIN FABRICAMODELOS ON FABRICAS.FabMod_id = FABRICAMODELOS.FabMod_id INNER JOIN TIPOFABRICA ON FABRICAMODELOS.Tf_Id = TIPOFABRICA.Tf_Id WHERE (FABRICAS.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op13, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(ARRESTADOSAUX.De_Nombres) + ' ' + RTRIM(ARRESTADOSAUX.De_Paterno) + ' ' + RTRIM(ARRESTADOSAUX.De_Materno) + ' ' + RTRIM(ARRESTADOSAUX.De_Esposo) + ' Nacionalidad: ' + PAIS.Descripcion FROM ARRESTADOSAUX INNER JOIN PAIS ON ARRESTADOSAUX.Pa_Id = PAIS.Pa_Id WHERE (ARRESTADOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op14, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(DETENIDOSAUX.De_Nombres) + ' ' + RTRIM(DETENIDOSAUX.De_Paterno) + ' ' + RTRIM(DETENIDOSAUX.De_Materno) + ' ' + RTRIM(DETENIDOSAUX.De_Esposo) + ' ' + RTRIM(PAIS.Descripcion) FROM DETENIDOSAUX INNER JOIN PAIS ON DETENIDOSAUX.Pa_Id = PAIS.Pa_Id INNER JOIN ESTADOCIVIL ON DETENIDOSAUX.Ec_id = ESTADOCIVIL.Ec_id WHERE (DETENIDOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op15, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(CATALOGOTIPO.Descripcion) FROM CATALOGOTIPO INNER JOIN ITEMBIENSECUESTRADO ON CATALOGOTIPO.CatTipo_Id = ITEMBIENSECUESTRADO.CatTipo_Id WHERE (ITEMBIENSECUESTRADO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op16 " +
                            "FROM ASIGNACION AS T1 INNER JOIN OPERATIVO AS T2 ON T1.Casos_Id = T2.Casos_Id INNER JOIN GRUPOS AS T5 INNER JOIN DISTRITALES AS T4 INNER JOIN UNIDADES AS T3 ON T4.Uni_Id = T3.Uni_Id ON T5.Dis_Id = T4.Dis_Id ON T1.Grp_Id = T5.Grp_Id INNER JOIN LOCALIDAD AS T8 ON T2.Loc_id = T8.Loc_id INNER JOIN PROVINCIAS AS T7 ON T8.Prov_Id = T7.Prov_Id INNER JOIN DEPARTAMENTOS AS T6 ON T7.Dpto_Id = T6.Dpto_Id INNER JOIN DETENIDOSAUX AS T9 ON T2.Op_Id = T9.Op_Id " +
                            "WHERE (T9.De_Nombres LIKE '%" + txtnombre.Text.Trim() + "%') AND (T9.De_Paterno LIKE '%" + txtpaterno.Text.Trim() + "%') AND (T9.De_Materno LIKE '%" + txtmaterno.Text.Trim() + "%') AND (T9.De_Esposo LIKE '%" + txtesposo.Text.Trim() + "%') ORDER BY op1 DESC";
            SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
            DataSet ds = new DataSet();
            cmd.Fill(ds);
            GridOperativos.DataSource = ds;
            GridOperativos.DataBind();
            con.Close();
        }
    }

    protected void btnarrestado_Click(object sender, EventArgs e)
    {
        if (txtnombre.Text.Trim() != "" || txtpaterno.Text.Trim() != "" || txtmaterno.Text.Trim() != "" || txtesposo.Text.Trim() != "")
        {
            GridOperativos.DataSource = null;
            GridOperativos.DataBind();
            string CadenaFinal;
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            con.Open();
            CadenaFinal = "SELECT T2.Op_Id AS op1, T1.NroOperativo AS op2, T1.NroCaso AS op3, T1.NombreCaso AS op4, T1.AsigCaso AS op5, CONVERT(varchar, CAST(T2.Op_FechaOperativo AS datetime), 103) AS op6, " +
                            "T6.Descripcion + '-' + T7.Descripcion + '-' + UPPER(T8.Descripcion) + '-' + UPPER(RTRIM(T2.Op_Lugar)) AS op7, UPPER(RTRIM(T4.Dis_Descripcion)) + '-' + UPPER(RTRIM(T5.Descripcion)) AS op8, " +
                            "ISNULL((SELECT REPLACE(CONVERT(varchar(128), CAST(SUM(CocaCantidad) AS money), 1), '.00', '') FROM HOJACOCA WHERE (Op_Id = T2.Op_Id)),'') AS op9, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOSDROGA.Descripcion) +' Estado: '+ RTRIM(ESTADODROGA.Descripcion) +' Cantidad: '+ convert(varchar, cast(DROGAS.Dg_Cantidad as money), 1) +' Grs. Forma de Transporte: '+ RTRIM(FORMASTRANS.Formas_Descripcion) FROM DROGAS INNER JOIN ESTADODROGA ON DROGAS.EstDg_Id = ESTADODROGA.EstDg_Id INNER JOIN FORMASTRANS ON DROGAS.Formas_Id = FORMASTRANS.Formas_Id INNER JOIN PAIS ON DROGAS.Pa_Id = PAIS.Pa_Id INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id INNER JOIN OPERATIVO ON DROGAS.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id WHERE (OPERATIVO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op10, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSSOLDESC.Ssd_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIASSOL.Ss_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIASSOL INNER JOIN SUSSOLDESC ON SUSTANCIASSOL.Ssd_Id = SUSSOLDESC.Ssd_Id WHERE (SUSTANCIASSOL.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op11, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(SUSLIQDESC.Sld_Descripcion) + ': ' + CONVERT(varchar, CAST(SUSTANCIALIQ.Sl_Cantidad AS money), 1) + 'Grs. ' FROM SUSTANCIALIQ INNER JOIN SUSLIQDESC ON SUSTANCIALIQ.Sld_Id = SUSLIQDESC.Sld_Id WHERE (SUSTANCIALIQ.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op12, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(TIPOFABRICA.Descripcion) + ': ' + REPLACE(CONVERT(varchar(128), CAST(FABRICAS.Cantidad AS money), 1), '.00', '') FROM FABRICAS INNER JOIN FABRICAMODELOS ON FABRICAS.FabMod_id = FABRICAMODELOS.FabMod_id INNER JOIN TIPOFABRICA ON FABRICAMODELOS.Tf_Id = TIPOFABRICA.Tf_Id WHERE (FABRICAS.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op13, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(ARRESTADOSAUX.De_Nombres) + ' ' + RTRIM(ARRESTADOSAUX.De_Paterno) + ' ' + RTRIM(ARRESTADOSAUX.De_Materno) + ' ' + RTRIM(ARRESTADOSAUX.De_Esposo) + ' Nacionalidad: ' + PAIS.Descripcion FROM ARRESTADOSAUX INNER JOIN PAIS ON ARRESTADOSAUX.Pa_Id = PAIS.Pa_Id WHERE (ARRESTADOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op14, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(DETENIDOSAUX.De_Nombres) + ' ' + RTRIM(DETENIDOSAUX.De_Paterno) + ' ' + RTRIM(DETENIDOSAUX.De_Materno) + ' ' + RTRIM(DETENIDOSAUX.De_Esposo) + ' ' + RTRIM(PAIS.Descripcion) FROM DETENIDOSAUX INNER JOIN PAIS ON DETENIDOSAUX.Pa_Id = PAIS.Pa_Id INNER JOIN ESTADOCIVIL ON DETENIDOSAUX.Ec_id = ESTADOCIVIL.Ec_id WHERE (DETENIDOSAUX.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op15, " +
                            "ISNULL((SELECT STUFF((SELECT ', ' + RTRIM(CATALOGOTIPO.Descripcion) FROM CATALOGOTIPO INNER JOIN ITEMBIENSECUESTRADO ON CATALOGOTIPO.CatTipo_Id = ITEMBIENSECUESTRADO.CatTipo_Id WHERE (ITEMBIENSECUESTRADO.Op_Id = T2.Op_Id) FOR XML PATH ('')),1,1, '')),'') AS op16 " +
                            "FROM ASIGNACION AS T1 INNER JOIN OPERATIVO AS T2 ON T1.Casos_Id = T2.Casos_Id INNER JOIN GRUPOS AS T5 INNER JOIN DISTRITALES AS T4 INNER JOIN UNIDADES AS T3 ON T4.Uni_Id = T3.Uni_Id ON T5.Dis_Id = T4.Dis_Id ON T1.Grp_Id = T5.Grp_Id INNER JOIN LOCALIDAD AS T8 ON T2.Loc_id = T8.Loc_id INNER JOIN PROVINCIAS AS T7 ON T8.Prov_Id = T7.Prov_Id INNER JOIN DEPARTAMENTOS AS T6 ON T7.Dpto_Id = T6.Dpto_Id INNER JOIN ARRESTADOSAUX AS T9 ON T2.Op_Id = T9.Op_Id " +
                            "WHERE (T9.De_Nombres LIKE '%" + txtnombre.Text.Trim() + "%') AND (T9.De_Paterno LIKE '%" + txtpaterno.Text.Trim() + "%') AND (T9.De_Materno LIKE '%" + txtmaterno.Text.Trim() + "%') AND (T9.De_Esposo LIKE '%" + txtesposo.Text.Trim() + "%') ORDER BY op1 DESC";
            SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
            DataSet ds = new DataSet();
            cmd.Fill(ds);
            GridOperativos.DataSource = ds;
            GridOperativos.DataBind();
            con.Close();
        }
    }
}